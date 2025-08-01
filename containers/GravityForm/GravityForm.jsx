import { useEffect, useState } from 'react';


const FormsGravityForm = (props) => {

  console.log(props);

  //////////////////////////////////////
  // ACF FIELDS
  const {
    formNum
  } = props;


  //////////////////////////////////////
  // STATE
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);


  //////////////////////////////////////
  // GRAVITY FORMS
  //get the gravity for data from the rest API
  useEffect(() => {
    if (!formNum) return;
    setLoading(true);
    fetch(`/api/gravity?id=${formNum}`)
      .then(res => res.json())
      .then(data => {
        setFormFields(data.fields || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [formNum]);


  //////////////////////////////////////
  // RENDER
  return (

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
  );

};

export default FormsGravityForm;