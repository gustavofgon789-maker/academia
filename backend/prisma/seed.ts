import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@gelveiculos.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@gelveiculos.com',
      password_hash: passwordHash,
      role: 'admin',
      is_active: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create site settings
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    const settings = await prisma.siteSettings.create({
      data: {
        business_name: 'Gel Veículos',
        whatsapp: '5517988194375',
        phone: '(17) 98819-4375',
        address: 'Rua Olavo Bilac, 19 - Urupes/SP',
        opening_hours: 'Segunda a Sexta: 8h às 18h\nSábado: 8h às 13h',
        hero_title: 'Seu próximo carro está aqui',
        hero_subtitle: 'Na Gel Veículos você encontra os melhores veículos seminovos com procedência garantida, facilidade no financiamento e atendimento personalizado.',
        instagram_url: 'https://instagram.com/Gel.veiculos',
        facebook_url: '',
        primary_color: '#dc2626',
      },
    });
    console.log('✅ Site settings created:', settings.business_name);
  } else {
    console.log('ℹ️ Site settings already exist, skipping...');
  }

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
