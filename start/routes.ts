/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AutoSwagger from "adonis-autoswagger";
import swagger from "Config/swagger";


// returns swagger in YAML
Route.get("/swagger", async () => {
  return AutoSwagger.docs(Route.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
Route.get("/docs", async () => {
  return AutoSwagger.ui("/swagger", swagger);
});

Route.get('/', async () => {
  return AutoSwagger.ui("/swagger", swagger);
})

Route.group(() => {
  Route.post('/register', 'UsersController.create')
  Route.post('/login', 'AuthController.login')
})
.prefix('/api/auth')

Route.group(() => {
  Route.get('/logout', 'AuthController.logout')
  Route.get('/users', 'UsersController.index')
}).prefix('/api/auth')
  .middleware('auth')


Route.group(() => {
  Route.get('/show', 'ShoesController.index')
  Route.post('/create', 'ShoesController.create')
  Route.put('/update/:id', 'ShoesController.update')
  Route.delete('/delete/:id', 'ShoesController.delete')
}).prefix('/api/shoes')
  .middleware('auth')

Route.group(() => {
  Route.post('/add/:id', 'CartsController.addToCart')
  Route.get('/show', 'CartsController.show')
  Route.delete('/remove/:id', 'CartsController.removeItem')
  Route.delete('/clear', 'CartsController.clearCart')
}).prefix('/api/cart')
  .middleware('auth')

Route.group(() => {
  Route.get('/show', 'OrdersController.index')
  Route.post('/checkout', 'OrdersController.checkout')
  Route.post('/update-status/:id', 'OrdersController.updateStatus')
  Route.get('/:id/status-history', 'OrdersController.statusHistory')
}).prefix('/api/orders')
  .middleware('auth')



