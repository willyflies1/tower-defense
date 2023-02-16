### STAGE 1: BUILD ###
FROM node:lts as build
# USER ec2-user
# ARG NODE_OPTIONS "--openssl-legacy-provider"
WORKDIR /usr/src/app
# COPY package.json package-lock.json ./
COPY package.json package-lock.json ./

# Install with legacy-peer-deps is a way to bypass
# peerDependency auto-installation
RUN npm install
COPY . .
RUN npm run build --prod

### STAGE 2: RUN ###
FROM nginx:stable-alpine
# USER ec2-user
# Remove default nginx website
# RUN rm -rf /usr/share/nginx/html/*

# Copy nginx config file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy self-signed cert
# COPY csr.pem /etc/ssl/csr.pem
# Copy key
# COPY private.key /etc/ssl/private.key

#  Copy bundle with the certificate file and  CA_bundle file
# COPY www_whfiles_com.crt /etc/ssl/www_whfiles_com.crt
# COPY www_whfiles_com.ca-bundle /etc/ssl/www_whfiles_com.ca-bundle

# Copy chain certificates
# COPY www_whfiles_com_chain.pem /etc/ssl/www_whfiles_com_chain.pem

# Copy dist folder from build stage to nginx public folder
COPY --from=build /usr/src/app/dist/tower-defense /usr/share/nginx/html
# Expose port 80
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
