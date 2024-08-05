export interface UnsplashImage {
    id: string;
    urls: {
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    alt_description: string;
    user: {
      name: string;
      links: {
        html: string;
      };
    };
    links: {
      download_location: string;
    };
  }