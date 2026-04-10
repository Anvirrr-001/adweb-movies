export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  trailer_id?: string;
  review_content?: string;
  quality?: string;
  duration?: string;
}

export interface SiteSettings {
  adsterra: {
    enabled: boolean;
    scripts: {
      social_bar: string;
      popunder: string;
      native_banner: string;
    },
    verification_tag: string;
  };
  site: {
    title: string;
    description: string;
    ads_txt: string;
  };
}
