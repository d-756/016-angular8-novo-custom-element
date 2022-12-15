import { Component, OnInit, NgZone } from "@angular/core";
// Vendor
import { FormUtils, TextBoxControl, SelectControl } from "novo-elements";
import { ApiService } from "src/app/api.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-party-list",
  templateUrl: "./party-list.component.html",
  styleUrls: ["./party-list.component.scss"]
})
export class PartyListComponent implements OnInit {
  // control for companies existing in intelagree
  public partyControl: any;
  public partyList: any = [];
  public partyListOptions: any = [];

  // control for adding new company
  public companyNameControl: any;
  public partyListForm: any;
  public addCompanyForm: any;

  // flag valiable for the spinner
  public isLoading = true;
  public responseData: any = [];
  public quertyString: any = [];

  constructor(
    private apiService: ApiService,
    private formUtils: FormUtils,
    private router: Router,
    private route: ActivatedRoute,
    private _ngZone: NgZone
  ) {
    document.body.className = "zoom-out";
  }

  ngOnInit(): void {
    this.quertyString = this.route.snapshot.params;
    // getContractTemplateList
    this.apiService.getPartyList(this.quertyString).then(res => {
      this.responseData = res;
      // console.log("***", res);
      this.partyList = this.responseData.data;
      this.partyList.forEach((element: any, index: any) => {
        this.partyListOptions.push({
          label: element.text,
          value: element.id
        });
      });

      // set the spinner flag to false.
      this.isLoading = false;
      // }
    });

    // configurate the forms
    this.formConfiguration(this.partyListOptions);
  }

  // event when clicking LINK EXISTING btn
  linkExisting(formObj) {
    // console.log("party list", formObj);
    if (!formObj.isValid) {
      window.alert("INTELAGREE COMPANY is required field!");
    } else {
      const options: any = formObj.form.controls.partyId.options;
      let selectedCompanyName: string;
      options.forEach(element => {
        if (element.value === formObj.value.partyId) {
          selectedCompanyName = element.label;
        }
        return;
      });
      const params = {
        partyId: formObj.value.partyId,
        selectedCompany: selectedCompanyName,
        appCode: this.quertyString.appCode,
        CorporationID: this.quertyString.CorporationID,
        UserID: this.quertyString.UserID,
        EntityID: this.quertyString.EntityID
      };
      this.apiService.companyLink(params).then(res => {
        if (res) {
          // console.log(res);
          const resData: any = res;
          const selectedParams = {
            CorporationID: resData.query_string.CorporationID,
            // k: resData.query_string.k,
            EntityID: resData.query_string.id
          };
          // console.log(selectedParams);
          this.apiService.getSelectedPartyList(selectedParams).then(res => {
            // console.log("------", res);
            let response: any = res;
            if (response.isSetup) {
              this.router.navigate([
                "/list-contracts",
                this.quertyString.appCode,
                this.quertyString.CorporationID,
                this.quertyString.UserID,
                this.quertyString.EntityID
              ]);
            }
          });
        }
      });
    }
  }

  // configurate the forms
  formConfiguration(partyListOptions: any) {
    this.partyControl = new SelectControl({
      key: "partyId",
      type: "select",
      dataType: "String",
      label: "IntelAgree Company",
      tooltip: "Company List",
      placeholder: "Select...",
      options: this.partyListOptions,
      required: true
    });
    this.partyListForm = this.formUtils.toFormGroup([this.partyControl]);

    this.companyNameControl = new TextBoxControl({
      key: "companyName",
      label: "Company Name",
      tooltip: "Company Name",
      required: true
    });
    this.addCompanyForm = this.formUtils.toFormGroup([this.companyNameControl]);
  }

  // event when clicking ADD NEW btn
  addNewCompany(formObj) {
    // console.log("company name", formObj.value);
    if (!formObj.isValid) {
      window.alert("COMPANY NAME is required field!");
    } else {
      const params = {
        name: formObj.value.companyName,
        appCode: this.quertyString.appCode,
        CorporationID: this.quertyString.CorporationID,
        UserID: this.quertyString.UserID,
        EntityID: this.quertyString.EntityID
      };
      this.isLoading = true;
      this.apiService
        .companyAdd(params)
        .then(res => {
          this.responseData = res;
          if (this.responseData) {
            // window.alert("success");
            this._ngZone.run(() => {
              this.partyList = this.responseData.data;
              this.partyListOptions = [];
              this.partyList.forEach((element: any, index: any) => {
                this.partyListOptions.push({
                  label: element.text,
                  value: element.id
                });
              });
              // reconfigurate the forms
              this.formConfiguration(this.partyListOptions);
              this.isLoading = false;
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
}
