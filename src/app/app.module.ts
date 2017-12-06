/*Module angular typescript imports */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSlideToggleModule, MatRadioModule} from '@angular/material';

/*Component and services typescript imports */
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { BusComponent } from './bus/bus.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { BusDataService } from './bus-data.service';


@NgModule({
  /*declarations for components from the application*/
  declarations: [
    AppComponent,
    MapComponent,
    BusComponent,
    SidemenuComponent
  ],
  /*imports for angular modules*/
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatRadioModule

  ],
  providers: [BusDataService],// for the bus(or route)data service
  bootstrap: [AppComponent]
})
export class AppModule { }
