"""
Servicio de ordenes - Logica de negocio para CRUD de Order
"""

from flask import abort
from api.models import db, User, Article, Order, OrderItem


class OrderService:

    @staticmethod
    def get_all():
        orders = Order.query.all()
        return [order.serialize() for order in orders]

    @staticmethod
    def get_by_id(order_id):
        order = Order.query.get(order_id)
        if order is None:
            abort(404, description=f"Orden con id {order_id} no encontrada")
        return order.serialize_with_items()

    @staticmethod
    def create(data):
        if "user_id" not in data:
            abort(400, description="El campo 'user_id' es obligatorio")

        # Verificar que el usuario existe
        user = User.query.get(data["user_id"])
        if user is None:
            abort(404, description=f"Usuario con id {data['user_id']} no encontrado")

        # Validar items antes de crear la orden
        validated_items = []
        if "items" in data and isinstance(data["items"], list):
            for item_data in data["items"]:
                if "article_id" not in item_data or "quantity" not in item_data:
                    abort(400, description="Cada item necesita 'article_id' y 'quantity'")

                article = Article.query.get(item_data["article_id"])
                if article is None:
                    abort(404, description=f"Articulo con id {item_data['article_id']} no encontrado")

                if not article.is_available:
                    abort(400, description=f"El articulo '{article.name}' no esta disponible")

                if article.stock < item_data["quantity"]:
                    abort(400, description=f"Stock insuficiente para '{article.name}'. Disponible: {article.stock}")

                validated_items.append((item_data, article))

        try:
            new_order = Order(
                user_id=data["user_id"],
                shipping_address=data.get("shipping_address")
            )

            for item_data, article in validated_items:
                order_item = OrderItem(
                    article_id=article.id,
                    quantity=item_data["quantity"],
                    unit_price=article.price
                )
                order_item.calculate_subtotal()
                new_order.items.append(order_item)

            db.session.add(new_order)
            db.session.flush()
            new_order.calculate_total()
            db.session.commit()
            return new_order.serialize_with_items()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al crear orden: {str(error)}")

    @staticmethod
    def update(order_id, data):
        order = Order.query.get(order_id)
        if order is None:
            abort(404, description=f"Orden con id {order_id} no encontrada")

        valid_statuses = ["pending", "paid", "shipped", "delivered", "cancelled"]

        if "status" in data:
            if data["status"] not in valid_statuses:
                abort(400, description=f"Estado invalido. Los estados validos son: {', '.join(valid_statuses)}")
            order.status = data["status"]

        if "shipping_address" in data:
            order.shipping_address = data["shipping_address"]

        try:
            db.session.commit()
            return order.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al actualizar orden: {str(error)}")

    @staticmethod
    def delete(order_id):
        order = Order.query.get(order_id)
        if order is None:
            abort(404, description=f"Orden con id {order_id} no encontrada")

        try:
            db.session.delete(order)
            db.session.commit()
            return {"message": f"Orden #{order_id} eliminada correctamente"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al eliminar orden: {str(error)}")
