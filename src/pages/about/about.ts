import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  items;
  savedParentNativeURLs = [];
  ROOT_DIRECTORY;

  fileName: string = 'TestFile.csv';
  counter: number = 0;
  fileList: Array<string> = [];

  constructor(public navCtrl: NavController,
              public plt: Platform,
              public fileNav: File,
              public alertCtrl: AlertController) {

    this.ROOT_DIRECTORY = fileNav.dataDirectory;;

    plt.ready()
      .then(() => {
        this.listDir(this.ROOT_DIRECTORY, '');
    })
  }

  createAndWriteFile() {
    let newFileName = `${this.counter}` + this.fileName;

    this.fileNav.writeFile(this.ROOT_DIRECTORY, newFileName, 'me, so, csv', {replace: true}).then((res) => {
      console.log('private doWrite', 'Create File:', res);
      this.fileList.push(newFileName);
      this.counter++;
      this.readFileContent();
    }).catch((error) => {
      console.error('private doWrite', 'Create File Error:', error);
    });

  }
  
  appendToFile() {
    let lastFile = this.fileList[this.fileList.length - 1];

    if (typeof lastFile !== 'undefined') {
      this.fileNav.writeExistingFile(this.ROOT_DIRECTORY, lastFile, 'append, to, csv').then((res) => {
        console.log('appendToFile', 'WriteExisting File:', res);
        this.readFileContent();
      }).catch((error) => {
        console.error('appendToFile', 'WriteExisting Error:', error);
      })
    } else {
      let alert = this.alertCtrl.create({
        title: 'No File',
        subTitle: 'No File to append',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

  deleteFile() {
    let lastFile = this.fileList[this.fileList.length - 1];

    if (typeof lastFile !== 'undefined') {
      this.fileNav.removeFile(this.ROOT_DIRECTORY, lastFile).then((res) => {
        console.log('deleteFile', 'Delete File:', res);
        this.fileList.pop();
        this.listDir(this.ROOT_DIRECTORY, '');

      }).catch((error) => {
        console.error('deleteFile', 'Delete File Error:', error);
      });
    }
  }

  private readFileContent() {
    let lastFile = this.fileList[this.fileList.length - 1];

    if (typeof lastFile !== 'undefined') {
      this.fileNav.readAsText(this.ROOT_DIRECTORY, lastFile).then((res) => {
        console.log('private readFileContent', 'Read File:', res);
        let alert = this.alertCtrl.create({
          title: 'File Content',
          subTitle: res,
          buttons: ['Dismiss']
        });
        alert.present();
        this.listDir(this.ROOT_DIRECTORY, '');

      }).catch((error) => {
        console.error('private readFileContent', 'Read File Error:', error);
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'No File',
        subTitle: 'No File to read',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

  /*------------------------------------*/
  /*---------FILE NAVIAGATION-----------*/
  /*------------------------------------*/
  goDown(item) {
    const parentNativeURL = item.nativeURL.replace(item.name, "");
    this.savedParentNativeURLs.push(parentNativeURL);

    this.listDir(parentNativeURL, item.name);
  }

  goUp() {
    const parentNativeURL = this.savedParentNativeURLs.pop();

    this.listDir(parentNativeURL, "");
  }

  private listDir = (path, dirName) => {
    this.fileNav
      .listDir(path, dirName)
      .then(entries => {
        this.items = entries;
      })
      .catch(this.handleError);
  };

  private handleError = error => {
    console.log("error reading,", error);
  };
}
