Tenant Management Backend

A backend application for managing tenants, invoices, and payment receipts using Express.js and MongoDB.

Features





JWT-based authentication for admin users.



CRUD operations for tenants, invoices, and payment receipts.



Partial payment handling applied to the oldest unpaid invoice.



PDF generation for invoices and receipts using pdf-lib.



Email notifications for payment confirmations using Nodemailer.

Prerequisites





Node.js (v16 or higher)



MongoDB (local or cloud instance)



Gmail account for sending notifications

Installation





Clone the repository:

git clone <repository-url>
cd tenant-management-backend



Install dependencies:

npm install



Create a .env file based on .env.example and fill in your credentials:

MONGODB_URI=mongodb://localhost:27017/tenant_management
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
PORT=3000



Start the server:

npm start

Or for development with auto-reload:

npm run dev

API Endpoints





Authentication:





POST /auth/register: Register a new admin.



POST /auth/login: Login and receive JWT token.



POST /auth/logout: Logout.



Tenants:





GET /tenants: List all tenants.



POST /tenants: Create a new tenant.



GET /tenants/:id: Get a tenant by ID.



PUT /tenants/:id: Update a tenant.



DELETE /tenants/:id: Delete a tenant.



Invoices:





GET /invoices: List all invoices.



POST /invoices: Create a new invoice (returns PDF).



GET /invoices/:id: Get an invoice by ID.



PUT /invoices/:id: Update an invoice.



DELETE /invoices/:id: Delete an invoice.



Receipts:





GET /receipts: List all receipts.



POST /receipts: Create a new receipt (returns PDF, sends email).



GET /receipts/:id: Get a receipt by ID.



PUT /receipts/:id: Update a receipt.



DELETE /receipts/:id: Delete a receipt.

Environment Variables





MONGODB_URI: MongoDB connection string.



JWT_SECRET: Secret key for JWT signing.



EMAIL_USER: Gmail address for sending notifications.



EMAIL_PASS: Gmail app-specific password.



PORT: Server port (default: 3000).

License

MIT"# rent-charge-backend" 


echo "# rent-charge-backend" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/JethroKimande/rent-charge-backend.git
git push -u origin main