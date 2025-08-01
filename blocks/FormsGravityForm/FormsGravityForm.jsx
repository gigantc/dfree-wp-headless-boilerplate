import { useEffect, useState } from 'react';
import GravityForm from '@/containers/GravityForm/GravityForm'
import styles from './FormsGravityForm.module.scss';


const FormsGravityForm = (props) => {

  // console.log(props);

  //////////////////////////////////////
  // ACF FIELDS
  const {
    theme,
    title,
    copy,
    form_select
  } = props;


  //////////////////////////////////////
  // RENDER
  return (
    <section
  className={[
    styles.gravityForm,
    theme ? styles[`gravityForm--${theme}`] : ''
  ].join(' ')}
>
      
      <div className={styles.wrap}>
        <div className={styles.text}>
          <h2>{title}</h2>
          <p>{copy}</p>
        </div>

        <GravityForm 
          formNum = {form_select}
          theme = {theme}
        />
        
      </div>
    </section>
  );
};

export default FormsGravityForm;