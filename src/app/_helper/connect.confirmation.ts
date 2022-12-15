import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute,
  ParamMap
} from "@angular/router";

@Injectable({ providedIn: "root" })
export class ConnectConfirmation implements CanActivate {
  private response: any = [];
  private queryParameters: any;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.activatedRoute.queryParamMap.subscribe(params => {
    //   this.queryParameters = params;
    // });
    // this.queryParameters = this.activatedRoute.snapshot.params;
    // this.queryParameters = {
    //   appCode: "BwYKBQ8GBAcLAQUCBAoIAQ",
    //   CorporationID: "14121",
    //   UserID: "2",
    //   EntityID: "5"
    // };

    console.log("custom card location: ", location.search);
    // var search = location.search.substring(1);
    // this.queryParameters = JSON.parse(
    //   '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    //   function(key, value) {
    //     return key === "" ? value : decodeURIComponent(value);
    //   }
    // );

    const search = location.search.substring(1);
    this.queryParameters = search
      .split("&")
      .map(part => ({
        [part.split("=")[0]]: part.split("=")[1]
      }))
      .reduce(
        (result, e) => ({
          ...result,
          ...e
        }),
        {}
      );

    console.log("params:", this.queryParameters);

    if (this.queryParameters) {
      this.apiService.getContractList(this.queryParameters).then(res => {
        this.response = res;
        if (this.response.isSetup) {
          this.router.navigate([
            "/list-contracts",
            this.queryParameters.appCode,
            this.queryParameters.CorporationID,
            this.queryParameters.UserID,
            this.queryParameters.EntityID
          ]);
        } else {
          this.router.navigate([
            "/party-list",
            this.queryParameters.appCode,
            this.queryParameters.CorporationID,
            this.queryParameters.UserID,
            this.queryParameters.EntityID
          ]);
        }
        return true;
      });
      return false;
    } else {
      return false;
    }
  }
}
