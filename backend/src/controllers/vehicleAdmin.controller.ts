import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { generateSlug } from '../utils/slug';

export class VehicleAdminController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const baseSlug = generateSlug(`${data.brand} ${data.model} ${data.version} ${data.year_model}`);
      
      // Ensure unique slug
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.vehicle.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          ...data,
          slug,
          price: parseFloat(data.price),
          promotional_price: data.promotional_price ? parseFloat(data.promotional_price) : null,
          options: data.options || [],
        },
        include: { images: true },
      });

      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Create vehicle error:', error);
      res.status(500).json({ error: 'Erro ao criar veículo' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body;

      const existing = await prisma.vehicle.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      const allowed = [
        'title', 'brand', 'model', 'version', 'year_fabrication', 'year_model',
        'price', 'promotional_price', 'mileage', 'transmission', 'fuel', 'color',
        'body_type', 'doors', 'plate_final', 'status', 'is_featured', 'is_promotion',
        'is_active', 'description', 'options', 'internal_notes',
      ] as const;

      const data: Record<string, any> = {};
      for (const key of allowed) {
        if (body[key] !== undefined) data[key] = body[key];
      }

      let slug = existing.slug;
      if (data.brand || data.model || data.version || data.year_model) {
        const b = data.brand || existing.brand;
        const m = data.model || existing.model;
        const v = data.version || existing.version;
        const y = data.year_model || existing.year_model;
        const newSlug = generateSlug(`${b} ${m} ${v} ${y}`);
        if (newSlug !== existing.slug) {
          let s = newSlug;
          let counter = 1;
          while (true) {
            const found = await prisma.vehicle.findUnique({ where: { slug: s } });
            if (!found || found.id === id) break;
            s = `${newSlug}-${counter}`;
            counter++;
          }
          slug = s;
        }
      }

      if (data.price !== undefined) data.price = parseFloat(data.price);
      if (data.promotional_price !== undefined && data.promotional_price !== null) {
        data.promotional_price = parseFloat(data.promotional_price);
      }

      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: { ...data, slug },
        include: { images: { orderBy: { sort_order: 'asc' } } },
      });

      res.json(vehicle);
    } catch (error) {
      console.error('Update vehicle error:', error);
      res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.vehicle.delete({ where: { id } });
      res.json({ message: 'Veículo removido com sucesso' });
    } catch (error) {
      console.error('Delete vehicle error:', error);
      res.status(500).json({ error: 'Erro ao remover veículo' });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: { status },
      });
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  }

  async updatePrice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { price, promotional_price } = req.body;
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: {
          price: parseFloat(price),
          promotional_price: promotional_price ? parseFloat(promotional_price) : null,
        },
      });
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar preço' });
    }
  }

  async toggleFeatured(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { is_featured } = req.body;
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: { is_featured },
      });
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar destaque' });
    }
  }

  async togglePromotion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { is_promotion } = req.body;
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: { is_promotion },
      });
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar promoção' });
    }
  }

  async listAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '20', search, status } = req.query;
      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));

      const where: any = {};
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { brand: { contains: search as string, mode: 'insensitive' } },
          { model: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [vehicles, total] = await Promise.all([
        prisma.vehicle.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          include: {
            images: { orderBy: { sort_order: 'asc' }, take: 1 },
            _count: { select: { leads: true } },
          },
        }),
        prisma.vehicle.count({ where }),
      ]);

      res.json({
        vehicles,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
      });
    } catch (error) {
      console.error('Admin list vehicles error:', error);
      res.status(500).json({ error: 'Erro ao listar veículos' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: { images: { orderBy: { sort_order: 'asc' } } },
      });
      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const [total, available, sold, reserved, featured, totalLeads, recentLeads] = await Promise.all([
        prisma.vehicle.count(),
        prisma.vehicle.count({ where: { status: 'available' } }),
        prisma.vehicle.count({ where: { status: 'sold' } }),
        prisma.vehicle.count({ where: { status: 'reserved' } }),
        prisma.vehicle.count({ where: { is_featured: true } }),
        prisma.lead.count(),
        prisma.lead.findMany({
          orderBy: { created_at: 'desc' },
          take: 5,
          include: { vehicle: { select: { title: true, brand: true, model: true } } },
        }),
      ]);

      res.json({ total, available, sold, reserved, featured, totalLeads, recentLeads });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }
}
