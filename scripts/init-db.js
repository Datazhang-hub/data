// 初始化数据库脚本
// 使用方法: node scripts/init-db.js

const { Pool } = require('pg');

// 创建PostgreSQL连接池
const pool = new Pool({
  user: 'postgres',
  password: '960627',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
});

// 测试数据库连接
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ 数据库连接成功');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ 数据库连接失败:', err);
    return false;
  }
}

// 执行查询
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error('❌ 查询执行失败:', err);
    throw err;
  }
}

// 创建项目表
async function createProjectsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      tags TEXT[] NOT NULL,
      demo_url TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTableQuery);
    console.log('✅ 项目表创建成功或已存在');
    return true;
  } catch (err) {
    console.error('❌ 创建项目表失败:', err);
    return false;
  }
}

// 初始化数据
async function initializeData() {
  // 检查是否已有数据
  const checkDataQuery = 'SELECT COUNT(*) FROM projects';
  const result = await query(checkDataQuery);
  
  if (parseInt(result.rows[0].count) > 0) {
    console.log('✅ 已存在项目数据，跳过初始化');
    return;
  }

  // 插入示例数据
  const insertDataQuery = `
    INSERT INTO projects 
    (title, description, image_url, tags, demo_url, type, date)
    VALUES
    (
      '电商店铺监控看板', 
      '基于 Power BI 开发的电商数据分析看板，实现店铺运营的实时监控。包含各类活动支付金额占比分析（双十一26.5%、新年促销18.98%等）、活动横向对比、每日在线商品数和动销率趋势等多维度分析，帮助运营团队实时掌握店铺经营状况，优化活动策略。', 
      '/images/project1.jpg',
      ARRAY['Power BI', '电商数据', '运营分析', '数据可视化'],
      'https://app.powerbi.com/view?r=eyJrIjoiMmVhNmJkZTUtMDc1OC00MmEzLTllZmItZTAwYWQ0OWRhMjA0IiwidCI6IjZmMGJiNzJmLTUzNzctNGRkZi05MzZhLWI2YzcyYmYyMWFlMiIsImMiOjF9',
      'visualization',
      '2024-03-01'
    ),
    (
      '城市达成率监控看板', 
      '基于 Power BI 开发的城市达成率监控看板，实时追踪各城市业务指标达成情况。通过多维度分析和可视化展示，帮助管理层快速了解各城市业务表现，及时发现问题并制定改进策略。', 
      '/images/project2.jpg',
      ARRAY['Power BI', '数据可视化', '业务监控', '城市分析'],
      'https://app.powerbi.com/view?r=eyJrIjoiZWNiNjY0NTAtNThmMS00N2I2LTk2OGQtYTRlZmVkNTQ4ODQzIiwidCI6IjZmMGJiNzJmLTUzNzctNGRkZi05MzZhLWI2YzcyYmYyMWFlMiIsImMiOjF9',
      'visualization',
      '2024-02-15'
    ),
    (
      '数据分析项目', 
      '使用Python和Pandas进行的数据清洗、分析和可视化项目，通过多种统计方法挖掘数据价值，形成决策支持。', 
      '/images/project3.jpg',
      ARRAY['Python', 'Pandas', '数据分析', '可视化'],
      'https://github.com/Datazhang-hub/DataShow',
      'analysis',
      '2024-01-20'
    );
  `;

  try {
    await query(insertDataQuery);
    console.log('✅ 初始化数据插入成功');
  } catch (err) {
    console.error('❌ 初始化数据插入失败:', err);
    throw err;
  }
}

// 主函数
async function main() {
  console.log('🚀 开始初始化数据库...');
  
  // 测试数据库连接
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ 无法连接到数据库，请检查配置');
    process.exit(1);
  }
  
  // 创建项目表
  await createProjectsTable();
  
  // 初始化数据
  await initializeData();
  
  console.log('✅ 数据库初始化完成');
  process.exit(0);
}

// 执行主函数
main().catch(err => {
  console.error('❌ 发生错误:', err);
  process.exit(1);
}); 