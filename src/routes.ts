import { Page } from './pages';
import { Route } from './app/router/route';
import { MainRoute } from './main/main.router';
import { CatalogRoute } from './catalog/catalog.router';
import { AuthRoute, ResetPasswordRoute } from './auth/auth.router';
import { ManageProductRoute, ProductRoute } from './product/product.router';
import { CartRoute, CheckoutRoute, OrderInfoRoute, OrdersRoute } from './cart/cart.router';
import { SavedRoute } from './saved/saved.router';
import { PricingRoute } from './pricing/pricing.router';
import { FaqRoute } from './faq/faq.router';
import { BlogRoute } from './blog/blog.router';
import { CompanyRoute } from './company/company.router';
import { NotFoundRoute } from './notFound/notFound.router';
import { ChatsRoute } from './chats/chats.router';
import { PageRoute } from './page/page.router';
import { AdminRoute } from './admin/admin.router';
import { AddShopRoute, ShopRoute } from './shop/shop.router';
import { PaymentRoute } from './payment/payment.router';
import { FeedRoute } from './feed/feed.router';
import { ProfileRoute } from './profile/profile.router';
import { ReviewsRoute } from './reviews/reviews.router';

export const Routes: Record<Page, Route> = {
  [Page.Main]: new MainRoute(),
  [Page.Auth]: new AuthRoute(),
  [Page.ResetPassword]: new ResetPasswordRoute(),
  [Page.Catalog]: new CatalogRoute(),
  [Page.UserCatalog]: CatalogRoute.forUser(),
  [Page.ShopCatalog]: CatalogRoute.forShop(),
  [Page.Product]: new ProductRoute(),
  [Page.Shop]: new ShopRoute(),
  [Page.Cart]: new CartRoute(),
  [Page.Orders]: new OrdersRoute(),
  [Page.Checkout]: new CheckoutRoute(),
  [Page.OrderInfo]: new OrderInfoRoute(),
  [Page.Saved]: new SavedRoute(),
  [Page.Pricing]: new PricingRoute(),
  [Page.ManageProduct]: new ManageProductRoute(),
  [Page.Faq]: new FaqRoute(),
  [Page.Blog]: new BlogRoute(),
  [Page.Company]: new CompanyRoute(),
  [Page.AddShop]: new AddShopRoute(),
  [Page.NotFound]: new NotFoundRoute(),
  [Page.Chats]: new ChatsRoute(),
  [Page.Page]: new PageRoute(),
  [Page.Admin]: new AdminRoute(),
  [Page.Payment]: new PaymentRoute(),
  [Page.Feed]: new FeedRoute(),
  [Page.Profile]: new ProfileRoute(),
  [Page.Reviews]: new ReviewsRoute(),
};
