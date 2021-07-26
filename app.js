import firebase from 'firebase/app';
import 'firebase/storage';
import { upload } from './upload.js';


const firebaseConfig = {
	apiKey: "AIzaSyA3fdCLs-z8Ccg2A3_n7D_yuurGgv_Xq1E",
	authDomain: "fb-upload-ed0a7.firebaseapp.com",
	projectId: "fb-upload-ed0a7",
	storageBucket: "fb-upload-ed0a7.appspot.com",
	messagingSenderId: "251912740370",
	appId: "1:251912740370:web:61183e36dcff0b3f0c02cb",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

console.log(storage);


upload('#file', {
	multi: true,// разрешить выбирать 1 или несколько файлов
	accept: ['.png', '.jpg', '.jpeg', '.gif'], // задайте допустимые форматы
	onUpload(files, blocks) {
		files.forEach((file, index) => {
			const ref = storage.ref(`images/${file.name}`);
			const task = ref.put(file);

			task.on('statechange', snapshot => {
					// определяем процент загрузки
					const percent = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
					const block = blocks[index].querySelector('.preview-info-progress');
					block.textContent = percent;
					block.style.width = percent;
				}, error => {
					console.log(error);
				}, () => {
					console.log('Completed');
					task.snapshot.ref.getDownloadURL().then(url => {
						console.log('Download URL: ' + url);
					});
				},
			);
		});
	},
});
