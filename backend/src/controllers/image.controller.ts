import { Request, Response } from 'express';
import prisma from '../config/prisma';
import fs from 'fs';
import path from 'path';

export class ImageController {
  async upload(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ error: 'Nenhuma imagem enviada' });
        return;
      }

      const vehicle = await prisma.vehicle.findUnique({ where: { id } });
      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      const existingCount = await prisma.vehicleImage.count({ where: { vehicle_id: id } });

      const images = await Promise.all(
        files.map((file, index) =>
          prisma.vehicleImage.create({
            data: {
              vehicle_id: id,
              image_url: `/uploads/${file.filename}`,
              is_main: existingCount === 0 && index === 0,
              sort_order: existingCount + index,
            },
          })
        )
      );

      res.status(201).json(images);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Erro ao enviar imagens' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { imageId } = req.params;
      const image = await prisma.vehicleImage.findUnique({ where: { id: imageId } });

      if (!image) {
        res.status(404).json({ error: 'Imagem não encontrada' });
        return;
      }

      // Delete file from disk
      const filePath = path.resolve('.' + image.image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await prisma.vehicleImage.delete({ where: { id: imageId } });

      // If deleted image was main, set next image as main
      if (image.is_main) {
        const nextImage = await prisma.vehicleImage.findFirst({
          where: { vehicle_id: image.vehicle_id },
          orderBy: { sort_order: 'asc' },
        });
        if (nextImage) {
          await prisma.vehicleImage.update({
            where: { id: nextImage.id },
            data: { is_main: true },
          });
        }
      }

      res.json({ message: 'Imagem removida com sucesso' });
    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({ error: 'Erro ao remover imagem' });
    }
  }

  async setMain(req: Request, res: Response): Promise<void> {
    try {
      const { imageId } = req.params;
      const image = await prisma.vehicleImage.findUnique({ where: { id: imageId } });

      if (!image) {
        res.status(404).json({ error: 'Imagem não encontrada' });
        return;
      }

      // Remove main from all images of this vehicle
      await prisma.vehicleImage.updateMany({
        where: { vehicle_id: image.vehicle_id },
        data: { is_main: false },
      });

      // Set this image as main
      await prisma.vehicleImage.update({
        where: { id: imageId },
        data: { is_main: true },
      });

      res.json({ message: 'Imagem principal definida' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao definir imagem principal' });
    }
  }

  async reorder(req: Request, res: Response): Promise<void> {
    try {
      const { images } = req.body; // [{ id, sort_order }]

      if (!Array.isArray(images)) {
        res.status(400).json({ error: 'Dados inválidos' });
        return;
      }

      await Promise.all(
        images.map((img: { id: string; sort_order: number }) =>
          prisma.vehicleImage.update({
            where: { id: img.id },
            data: { sort_order: img.sort_order },
          })
        )
      );

      res.json({ message: 'Ordem atualizada' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao reordenar imagens' });
    }
  }
}
