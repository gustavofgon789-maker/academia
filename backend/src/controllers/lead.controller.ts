import { Request, Response } from 'express';
import prisma from '../config/prisma';

export class LeadController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const lead = await prisma.lead.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          vehicle_id: data.vehicle_id || null,
          message: data.message || null,
          source: data.source || 'website',
          status: 'new',
        },
      });
      res.status(201).json(lead);
    } catch (error) {
      console.error('Create lead error:', error);
      res.status(500).json({ error: 'Erro ao criar lead' });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '20', status, search } = req.query;
      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));

      const where: any = {};
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [leads, total] = await Promise.all([
        prisma.lead.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          include: {
            vehicle: { select: { id: true, title: true, brand: true, model: true, slug: true } },
          },
        }),
        prisma.lead.count({ where }),
      ]);

      res.json({
        leads,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
      });
    } catch (error) {
      console.error('List leads error:', error);
      res.status(500).json({ error: 'Erro ao listar leads' });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const lead = await prisma.lead.update({
        where: { id },
        data: { status },
      });
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar status do lead' });
    }
  }
}
