export class HomepageHelper {
  static magic_post_id: string;

  static isHomepagePath = () =>
    window.location.pathname === `/post/${this.magic_post_id}` ||
    window.location.pathname === `/`;
}
