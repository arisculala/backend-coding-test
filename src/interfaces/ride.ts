
export interface CreateRide {
    start_lat: number;
    start_long: number;
    end_lat: number;
    end_long: number;
    rider_name: string;
    driver_name: string;
    driver_vehicle: string;
}

export interface Ride {
    ride_id: number;
    start_lat: number;
    start_long: number;
    end_lat: number;
    end_long: number;
    rider_name: string;
    driver_name: string;
    driver_vehicle: string;
}

export interface IRideService {
    create(data: CreateRide): Promise<any>;
    findAllCount(): Promise<any>;
    findAllPagination(data: any): Promise<any>;
    findRideById(data: Number): Promise<any>;
}