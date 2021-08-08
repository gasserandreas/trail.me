import RouteEditState from '../../entities/route-edit/types';

type RootState = {
  appTime: number;
  application: {
    status: string;
  };
  map: {
    viewport: {
      center: Array<number>;
      zoom: number;
    };
    location: Array<number>;
  };
  routeEdit: RouteEditState;
  // route: {
  //   id: GUID;
  //   name: string;
  // };
  statistics: any;
};

export default RootState;
