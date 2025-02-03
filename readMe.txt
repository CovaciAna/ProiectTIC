#Scop:
Aplicatie medicala de gestiune a pacientiilor si a meniurilor atribuite acestora.

#Scurta descriere:
Proiectul este construit ca SPA (aplicatia nu reincarca pagina la fiecare navigare), foloseste routing dinamic (Vue Router). 
Pentru controlul starii foloseste Vuex, iar pentru autentificare si stocarea datelor foloseste Firebase.

#Principalele componente/viewuri:
 - Pagina de autentificare (login/register)
 - Pagina principala a aplicatiei
 - Pagina cu lista pacientilor, unde se pot adauga/sterge pacienti si modifica informatii despre cei actuali (alergii, diagnostice)
 - Lista meniurilor, unde se pot adauga si edita meniurile; in plus se pot asigna meniurile pacientilor
 - Ca si componenta reutilizabila: MessageBox


 #Functionalitati principale:
 - Autentificare utilizatori (Firebase Auth)
 - Gestionare pacienti - add, edit, delete
 - Gestionare meniuri - add, edit
 - Atribuire meniuri pacienti
 - Protectie rute -> acces la paginile securizate doar dupa login

