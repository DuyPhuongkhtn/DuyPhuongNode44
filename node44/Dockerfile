# cài môi trường node
FROM node:20

# tạo folder chứa source code
WORKDIR /home/app

# copy file package.json và package-lock.json vào docker
COPY package*.json ./

# cài lib trong file package.json
RUN npm install

# copy prisma từ local sang docker
# vừa copy từ local vừa tạo folder mới có tên là prisma trong docker
COPY prisma ./prisma/

# tạo prisma client
RUN npx prisma generate

# copy toàn bộ source code vào docker
COPY . .

# EXPOSE port
EXPOSE 8080

# chạy source BE
CMD ["npm", "run", "start"]