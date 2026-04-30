import { Request, Response } from 'express';
import prisma from '../config/prisma';

export class SettingsController {
  async get(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await prisma.siteSettings.findFirst();
      if (!settings) {
        res.status(404).json({ error: 'Configurações não encontradas' });
        return;
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const existing = await prisma.siteSettings.findFirst();

      if (!existing) {
        const settings = await prisma.siteSettings.create({ data });
        res.json(settings);
        return;
      }

      const settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data,
      });
      res.json(settings);
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }
  }
}
