import { useEffect, useState } from 'react';

import GravityForm from '@/containers/GravityForm/GravityForm'

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
    <section className={`gravityForm gravityForm--${theme}`}>
      
      <div className="wrap">
        <div className="text">
          <h2>{title}</h2>
          <p>{copy}</p>
        </div>

        <GravityForm 
          formNum = {form_select}
        />

      </div>
    </section>
  );
};

export default FormsGravityForm;