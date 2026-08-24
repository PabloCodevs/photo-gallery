import { Component, OnInit, inject } from '@angular/core';
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
  ActionSheetController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { camera, trash, close } from 'ionicons/icons';
import { UserPhoto } from '../services/photo.service';
import { PhotoService } from '../services/photo.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonFab, IonFabButton, IonIcon],
})

export class Tab2Page implements OnInit {
  public photoService = inject(PhotoService);

  // Inyectar el controlador de ActionSheet
  private actionSheetController = inject(ActionSheetController);

  constructor() {
    addIcons({ camera, trash, close });
  }

  // CAMBIO: Añadir la llamada a `loadSaved()` al navegar a la pestaña de fotos
  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  // Método showActionSheet()
  public async showActionSheet(photo: UserPhoto, position: number){
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePhoto(photo, position);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nada que hacer, el action sheet se cierra automáticamente
          },
        },
      ],
    });
    await actionSheet.present();
  }
}