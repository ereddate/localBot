FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package文件并安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 创建非root用户以提高安全性
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# 暴露端口
EXPOSE 3000

# 创建必要的目录并设置权限
RUN mkdir -p ./memory ./sessions ./skills && chmod -R 755 ./memory ./sessions ./skills

# 启动命令
CMD ["node", "dist/index.js"]