import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import {
  NovoElementsModule,
  FieldInteractionApi,
  NovoToastService,
  NovoModalService
} from "novo-elements";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AddNewContractComponent } from "./add-new-contract/add-new-contract.component";
import { ListContractsComponent } from "./list-contracts/list-contracts.component";
import { LinkCellComponent } from "./list-contracts/extras/link-cell.component";
import { PartyListComponent } from "./party-list/party-list.component";

@NgModule({
  declarations: [
    AppComponent,
    LinkCellComponent,
    AddNewContractComponent,
    ListContractsComponent,
    PartyListComponent
  ],
  entryComponents: [LinkCellComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NovoElementsModule
  ],
  providers: [FieldInteractionApi, NovoToastService, NovoModalService],
  bootstrap: [AppComponent]
})
export class AppModule {}
