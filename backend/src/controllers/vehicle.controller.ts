import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export class VehicleController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const {
        brand, model, year_min, year_max, price_min, price_max,
        mileage_max, transmission, fuel, status, body_type,
        search, sort, page = '1', limit = '12',
      } = req.query;

      const where: Prisma.VehicleWhereInput = {
        is_active: true,
      };

      if (brand) where.brand = { equals: brand as string, mode: 'insensitive' };
      if (model) where.model = { contains: model as string, mode: 'insensitive' };
      if (transmission) where.transmission = transmission as string;
      if (fuel) where.fuel = fuel as string;
      if (status) where.status = status as string;
      if (body_type) where.body_type = body_type as string;

      if (year_min || year_max) {
        where.year_model = {};
        if (year_min) where.year_model.gte = parseInt(year_min as string);
        if (year_max) where.year_model.lte = parseInt(year_max as string);
      }

      if (price_min || price_max) {
        where.price = {};
        if (price_min) where.price.gte = parseFloat(price_min as string);
        if (price_max) where.price.lte = parseFloat(price_max as string);
      }

      if (mileage_max) {
        where.mileage = { lte: parseInt(mileage_max as string) };
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { brand: { contains: search as string, mode: 'insensitive' } },
          { model: { contains: search as string, mode: 'insensitive' } },
          { version: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      let orderBy: Prisma.VehicleOrderByWithRelationInput = { created_at: 'desc' };
      switch (sort) {
        case 'price_asc': orderBy = { price: 'asc' }; break;
        case 'price_desc': orderBy = { price: 'desc' }; break;
        case 'year_desc': orderBy = { year_model: 'desc' }; break;
        case 'mileage_asc': orderBy = { mileage: 'asc' }; break;
        case 'featured': orderBy = { is_featured: 'desc' }; break;
      }

      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
      const skip = (pageNum - 1) * limitNum;

      const [vehicles, total] = await Promise.all([
        prisma.vehicle.findMany({
          where,
          orderBy,
          skip,
          take: limitNum,
          include: {
            images: {
              orderBy: { sort_order: 'asc' },
            },
          },
        }),
        prisma.vehicle.count({ where }),
      ]);

      res.json({
        vehicles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      console.error('Vehicle list error:', error);
      res.status(500).json({ error: 'Erro ao listar veículos' });
    }
  }

  async featured(req: Request, res: Response): Promise<void> {
    try {
      const vehicles = await prisma.vehicle.findMany({
        where: { is_active: true, is_featured: true },
        include: {
          images: { orderBy: { sort_order: 'asc' } },
        },
        orderBy: { created_at: 'desc' },
        take: 8,
      });

      res.json(vehicles);
    } catch (error) {
      console.error('Featured vehicles error:', error);
      res.status(500).json({ error: 'Erro ao buscar destaques' });
    }
  }

  async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const vehicle = await prisma.vehicle.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { sort_order: 'asc' } },
        },
      });

      if (!vehicle) {
        res.status(404).json({ error: 'Veículo não encontrado' });
        return;
      }

      // Get related vehicles
      const related = await prisma.vehicle.findMany({
        where: {
          is_active: true,
          id: { not: vehicle.id },
          OR: [
            { brand: vehicle.brand },
            { body_type: vehicle.body_type },
          ],
        },
        include: {
          images: { orderBy: { sort_order: 'asc' }, take: 1 },
        },
        take: 4,
      });

      res.json({ vehicle, related });
    } catch (error) {
      console.error('Vehicle detail error:', error);
      res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  }

  async getBrands(_req: Request, res: Response): Promise<void> {
    try {
      const brands = await prisma.vehicle.findMany({
        where: { is_active: true },
        select: { brand: true },
        distinct: ['brand'],
        orderBy: { brand: 'asc' },
      });
      res.json(brands.map(b => b.brand));
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar marcas' });
    }
  }
}
