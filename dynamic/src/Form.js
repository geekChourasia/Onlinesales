import React, { useState, useEffect } from "react";
import "./styles.css";

const Form = () => {
  const [formFields, setFormFields] = useState([]);
//   const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [savedConfigurations, setSavedConfigurations] = useState([]);
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // New state for saving indicator

  const fieldTypes = [
    { label: "Text Input", value: "text" },
    { label: "Text Area", value: "textarea" },
    { label: "Dropdown", value: "dropdown" },
    { label: "Checkbox", value: "checkbox" },
    { label: "Radio Button", value: "radio" }
  ];

  useEffect(() => {
    // Load configurations from local storage
    const storedConfigurations = localStorage.getItem("savedConfigurations");
    if (storedConfigurations) {
      setSavedConfigurations(JSON.parse(storedConfigurations));
    }
  }, []);

  const addFormField = (fieldType) => {
    const newField = { type: fieldType, label: "", options: [] };
    setFormFields([...formFields, newField]);
  };

  const removeFormField = (index) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;
    setFormFields(updatedFields);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].options[optionIndex] = value;
    setFormFields(updatedFields);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    let isValid = true;

    formFields.forEach((field, index) => {
      if (!field.label) {
        errors[index] = "Label is required";
        isValid = false;
      }
    });

    setFormErrors(errors);

    if (isValid) {
      // Form is valid, you can process the form data here
      console.log("Form data:", { formFields });
    }
  };

  const saveConfiguration = () => {
    setIsSaving(true); // Set saving indicator to true
    const newConfiguration = { formFields };
    const updatedConfigurations = [...savedConfigurations, newConfiguration];
    setSavedConfigurations(updatedConfigurations);
    localStorage.setItem(
      "savedConfigurations",
      JSON.stringify(updatedConfigurations)
    );

    setTimeout(() => {
      // Simulate a delay (you can replace this with an actual API call)
      setIsSaving(false); // Set saving indicator back to false
    }, 2000); // Simulated 2 seconds delay
  };

  const loadConfiguration = (configuration) => {
    setFormFields(configuration.formFields);
    setSelectedConfiguration(configuration);
  };

  const clearForm = () => {
    setFormFields([]);
    setSelectedConfiguration(null);
  };

  return (
    <div className="container">
      <h1>Dynamic Form Generator</h1>
      <button className="button-secondary" onClick={() => addFormField("text")}>
        Add Text Input
      </button>
      <button
        className="button-secondary"
        onClick={() => addFormField("textarea")}
      >
        Add Text Area
      </button>
      <button
        className="button-secondary"
        onClick={() => addFormField("dropdown")}
      >
        Add Dropdown
      </button>
      <button
        className="button-secondary"
        onClick={() => addFormField("checkbox")}
      >
        Add Checkbox
      </button>
      <button
        className="button-secondary"
        onClick={() => addFormField("radio")}
      >
        Add Radio Button
      </button>

      <form className="form-container" onSubmit={handleFormSubmit}>
        {formFields.map((field, index) => (
          <div key={index}>
            <div className="field-container">
              <div className="field-type">
                <label>Field Type:</label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    handleFieldChange(index, "type", e.target.value)
                  }
                >
                  {fieldTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-label">
                <label>Label:</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    handleFieldChange(index, "label", e.target.value)
                  }
                />
              </div>
            </div>
            {field.type === "dropdown" && (
              <div>
                <label>Options:</label>
                {field.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, optionIndex, e.target.value)
                      }
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    handleFieldChange(index, "options", [...field.options, ""]);
                  }}
                >
                  Add Option
                </button>
              </div>
            )}
            {formErrors[index] && (
              <div style={{ color: "red" }}>{formErrors[index]}</div>
            )}
            <button
              className="button-danger"
              onClick={() => removeFormField(index)}
            >
              Remove Field
            </button>
          </div>
        ))}
        <button type="submit" className="button-primary">
          Submit Form
        </button>
        <button onClick={saveConfiguration} className="button-success">
          Save Configuration
        </button>
        {isSaving && <div className="saving-indicator">Saving...</div>}
        <h2>Saved Configurations</h2>
        <ul>
          {savedConfigurations.map((config, index) => (
            <li key={index}>
              <button
                onClick={() => loadConfiguration(config)}
                className="button-load-config"
              >
                Load Configuration {index + 1}
              </button>
            </li>
          ))}
        </ul>
        {selectedConfiguration && (
          <button onClick={clearForm} className="button-warning">
            Clear Form
          </button>
        )}
      </form>
    </div>
  );
};

export default Form;
