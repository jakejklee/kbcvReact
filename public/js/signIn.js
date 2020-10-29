// import firebase from './firebase';

const e = React.createElement;

class signIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
      }
    
      render() {
        if (this.state.liked) {
          return 'You liked this.';
        }
    
        return e(
          'button',
          { onClick: () => this.setState({ liked: true }) },
          'Like'
        );
      }
    }
    
    const domContainer = document.querySelector('#signinDiv');
    ReactDOM.render(e(signIn), domContainer);
//     constructor(props) {
//         super(props);
//         this.state = { liked: false };
//     }

//     signin = () => {
//         const userID = document.getElementById("userID");
//         const userPW = document.getElementById("userPW");

//         firebase.auth().signInWithEmailAndPassword(userID, userPW).then(() => {
//             console.log('login sucess')
//         }).catch((e) => {
//             console.log(e)
//         })
//     }

//     render() {
//         return(
//             <div>
//                 <div style={{color:'blue'}}>testing</div>
//                 <div class="modal-footer">
//                     <button type="button" class="btn btn-secondary" data-dismiss="modal"
//                     onClick={()=>{console.log('close')}}>Close</button>
//                     <button type="button" class="btn btn-primary"
//                     onClick={()=>{console.log('signin')}}>Signin</button>
//                 </div>
//             </div>
//         );
//     }
// }

// const domContainer = document.querySelector('#signinDiv');
// ReactDOM.render((signIn), domContainer);
