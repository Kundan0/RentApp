import firebase from './Firebase'
import { firestore } from 'firebase';

const saveUsersData = (uid, userData, ismerge = true) => {
    firebase.firestore().collection('users').doc(uid).
        set(userData, { merge: ismerge })
        .catch((err) => console.log('Error is here'))
}

const signUp = async (username, password) => {
    const userData = {
        email: username + '@rent.com',
        createdAt: new Date(),
        username: username,
        noOfRoomsUploades: 0,
        favRooms: [],
        name: {
            firstName: '',
            lastName: '',
        },
        gender: '',
        address:
        {
            province: '',
            district: '',
            city: ''
        },
        profilePic: ''

    }
    firebase.auth()
        .createUserWithEmailAndPassword(username + "@rent.com", password)
        .then((res) => {
            saveUsersData(res.user.uid, userData)
            return res
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                return ('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                return ('That email address is invalid!');
            }

            console.error(error);
            return null
        })
}

const signIn = async (username, password) => {
    const response = firebase.auth()
        .signInWithEmailAndPassword(username + "@rent.com", password)
        .catch((err) => { return })
    return response;

}


const getUsersData = (uid, func) => {
    firebase.firestore().collection('users').doc(uid)
        .onSnapshot((doc) => {
            func(doc.data())
        })
}

const signout = () => {
    firebase.auth().signOut().then((x) =>
        console.log(x)
    )
}
const getLoggedUser = async (onValueGet) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            onValueGet(user)
        }
        else {
            onValueGet(null)
        }
    })

}
const saveTenantRoom = (roomData, onSave) => {
    firebase.firestore().collection('tenantPost')
        .add(roomData, { merge: true }).then(
            () => {
                onSave();
            }
        ).catch((err) => { console.log(err) })
}



const fetchRoomforloggedInUser = async (uid, isOwner) => {
    const Rooms = []

    if (isOwner) {
        firebase.firestore().collection('ownerPost')
            .where('authorId' == uid).get()
            .then((querSnanpshot) => {
                querSnanpshot.forEach((doc) => {
                    Rooms.append(doc)
                })
                return Rooms;

            }).catch((err) => { throw err; })



    }
}




export { saveUsersData, signIn, signUp, getUsersData, signout }
export { getLoggedUser, saveTenantRoom, fetchRoomforloggedInUser }