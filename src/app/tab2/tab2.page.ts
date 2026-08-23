import { Component, Inject } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { camera, images } from 'ionicons/icons';
import { PhotoService} from '../services/photo.service';
import { Photo } from '@capacitor/camera';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonFab, IonFabButton, IonIcon]
})

export class Tab2Page {

  // Inyectamos el servicio directamente en el constructor usando 'public'
  constructor(public photoService: PhotoService) {
    // Registramos los iconos para que Ionic los muestre correctamente
    addIcons({ camera, images });
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}