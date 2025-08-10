import 'dotenv/config';
import express from 'express';
import pkg from 'body-parser';
const { json } = pkg;
import cors from 'cors';
import { connect } from 'mongoose';

import itemRoutes from './routes/items.js';

const app = express();

// 中间件
app.use(json());
app.use(cors());

// 路由
app.use('/api/items', itemRoutes);

// 数据库连接
connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});