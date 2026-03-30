export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

export const movies2026: Movie[] = [
  {
    id: 1,
    title: "Avatar: Fire and Ash",
    poster_path: "/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg",
    backdrop_path: "/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg",
    release_date: "2026-12-18",
    vote_average: 8.8,
    overview: "Jake Sully and Neytiri face off against the 'Ash People', a tribe of Na'vi who represent the darker side of Pandora. This installment explores the volcanic regions of the planet.",
    genre_ids: [28, 12, 878]
  },
  {
    id: 2,
    title: "Avengers: Doomsday",
    poster_path: "/s2Fkuq0tj7mjAHEdbfQkFkdbeRI.jpg",
    backdrop_path: "/s2Fkuq0tj7mjAHEdbfQkFkdbeRI.jpg",
    release_date: "2026-05-01",
    vote_average: 9.2,
    overview: "The Avengers assemble once again to face Robert Downey Jr. as Victor Von Doom in the beginning of a multi-part multiverse event.",
    genre_ids: [28, 12, 878]
  },
  {
    id: 3,
    title: "The Batman Part II",
    poster_path: "/hUe1G6Ziwl8b6DaaGHjhG6LQQH8.jpg",
    backdrop_path: "/hUe1G6Ziwl8b6DaaGHjhG6LQQH8.jpg",
    release_date: "2026-10-02",
    vote_average: 8.5,
    overview: "Robert Pattinson returns as the Dark Knight in a Gotham City still reeling from the events of the first film, facing a new threat from the shadows.",
    genre_ids: [18, 80]
  },
  {
    id: 4,
    title: "Spider-Man: Beyond the Spider-Verse",
    poster_path: "/9PIhQqqI6Q4a5YjwMjxvzZcPJhf.jpg",
    backdrop_path: "/9PIhQqqI6Q4a5YjwMjxvzZcPJhf.jpg",
    release_date: "2026-06-15",
    vote_average: 9.4,
    overview: "Miles Morales must lead a team of Spider-People to stop a threat that spans the entire multiverse, reconciling his past with a uncertain future.",
    genre_ids: [16, 28, 12]
  },
  {
    id: 5,
    title: "Supergirl: Woman of Tomorrow",
    poster_path: "/niSvU02l2BONH9ivubV6K1a5QiK.jpg",
    backdrop_path: "/niSvU02l2BONH9ivubV6K1a5QiK.jpg",
    release_date: "2026-06-26",
    vote_average: 8.2,
    overview: "Kara Zor-El travels the galaxy to escape the shadow of her famous cousin and find her own destiny, based on the hit Tom King comic run.",
    genre_ids: [28, 878]
  },
  {
    id: 6,
    title: "The Super Mario Bros. Movie 2",
    poster_path: "/eJGWx219ZcEMVQJhAgMiqo8tYY.jpg",
    backdrop_path: "/eJGWx219ZcEMVQJhAgMiqo8tYY.jpg",
    release_date: "2026-04-03",
    vote_average: 8.4,
    overview: "Mario and Luigi return to the Mushroom Kingdom for another colorful adventure, encountering new Nintendo icons along the way.",
    genre_ids: [16, 12, 10751]
  }
];
