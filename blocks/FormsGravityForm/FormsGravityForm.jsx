import { useEffect, useState } from 'react';

const FormsGravityForm = (props) => {


  console.log(props);

  //////////////////////////////////////
  // STATE
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);


  //////////////////////////////////////
  // ACF FIELDS
  const {
    theme,
    title,
    copy,
    form_select
  } = props;

  //key: ck_0ca5cd6a562d3df6f8eb63249d01767cb13394fb
  //secret: cs_24c59404bb3c1466c6f751ccdbb089af141aef52

  //////////////////////////////////////
  // GRAVITY FORMS

  //get the gravity for data from the rest API
  useEffect(() => {
    if (!form_select) return;
    setLoading(true);
    fetch(`/api/gravity?id=${form_select}`)
      .then(res => res.json())
      .then(data => {
        setFormFields(data.fields || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [form_select]);



  //////////////////////////////////////
  // RENDER
  return (
    <section className={`gravityForm gravityForm--${theme}`}>
      
      <div className="wrap">
        <div className="text">
          <h2>{title}</h2>
          <p>{copy}</p>
        </div>

        <div className="form">
          {loading && <div>Loading form...</div>}
          {!loading && (
            <form>
              {formFields.map(field => (
                <div key={field.id}>
                  {field.type === 'text' && (
                    <input 
                      id={`field_${field.id}`} 
                      type="text" 
                      name={field.id} 
                      placeholder={field.placeholder || ''} 
                    />
                  )}
                  {field.type === 'email' && (
                    <input 
                      id={`field_${field.id}`} 
                      type="email" 
                      name={field.id} 
                      placeholder={field.placeholder || ''} 
                    />
                  )}
                  {field.type === 'phone' && (
                    <input 
                      id={`field_${field.id}`} 
                      type="tel" 
                      name={field.id} 
                      placeholder={field.placeholder || ''} 
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea 
                      id={`field_${field.id}`} 
                      name={field.id} 
                      placeholder={field.placeholder || ''} 
                    />
                  )}
                  {field.type === 'name' && field.inputs && (
                    <div>
                      {field.inputs
                        .filter(input => !input.isHidden)
                        .map(input => (
                          <input
                            key={input.id}
                            id={`field_${input.id}`}
                            name={input.id}
                            type="text"
                            placeholder={input.placeholder || input.label || ''}
                          />
                        ))}
                    </div>
                  )}
                  {/* Extend this as needed for more field types */}
                </div>
              ))}
              <button type="submit" className="gform_button">Submit</button>
            </form>
          )}
        </div>

        
      </div>
    </section>
  );
};

export default FormsGravityForm;