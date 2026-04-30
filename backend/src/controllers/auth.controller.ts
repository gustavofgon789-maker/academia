import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { env } from '../config/env';
import { AuthRequest } from '../middlewares/auth';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await prisma.adminUser.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'E-mail ou senha inválidos' });
        return;
      }

      if (!user.is_active) {
        res.status(401).json({ error: 'Usuário desativado' });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        res.status(401).json({ error: 'E-mail ou senha inválidos' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await prisma.adminUser.findUnique({
        where: { id: req.userId },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
