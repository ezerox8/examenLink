export interface Info {
    count: number;
    pages: number;
    next: string;
    prev: null;
}

export interface OriginLocation {
    name: string;
    url: string;
}

export interface Results {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: OriginLocation;
    location: OriginLocation;
    image: string;
    episode: [string];
    url: string;
    created: string;
}

export interface Characters {
    info: Info;
    results: Results[];
}
