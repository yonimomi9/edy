import Title from '../Title/Title';
import SignInButton from '../SignInButton/SignInButton';
import SignUpButton from '../SignUpButton/SignUpButton';
import styles from './Home.module.css';

const Home = () => {
    return ( 
        <div className={styles.home}>
            <Title />
            <div className={styles.buttons}>
                <SignInButton />
                <SignUpButton />
            </div>
        </div>
     );
}

export default Home;
