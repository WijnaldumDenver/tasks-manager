import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  "projectId": "tasksmanager-2b34d",
  "appId": "1:739127811129:web:7620d395797df1de7341e8",
  "storageBucket": "tasksmanager-2b34d.appspot.com",
  "apiKey": "AIzaSyBkMA1Gvre88gGIE7ALFD_abEIj_JS6F5E",
  "authDomain": "tasksmanager-2b34d.firebaseapp.com",
  "messagingSenderId": "739127811129"
}

export const firebaseApp = initializeApp(firebaseConfig);