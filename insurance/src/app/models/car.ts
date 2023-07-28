export interface Root {
    data: Data
}

export interface Data {
    car_Model_Lists: CarModelLists
}

export interface CarModelLists {
    results: Result[]
}

export interface Result {
    Category: string
    Make: string
    Model: string
    Year: number
}
