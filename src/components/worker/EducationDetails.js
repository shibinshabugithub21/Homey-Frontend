import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/footer';


const EducationDetails = () => {
  const route = useRouter();
  const [education, setEducation] = useState({
    highestLevel: '',
    institution: '',
    fieldOfStudy: '',
    yearOfPassing: '',
  });

  const [employment, setEmployment] = useState({
    dateOfHire: '',
    department: '',
    jobStatus: '',
  });

  const [personalDetails, setPersonalDetails] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedPersonalDetails = JSON.parse(localStorage.getItem('personalDetails'));
    if (storedPersonalDetails) {
      setPersonalDetails(storedPersonalDetails);
    }
  }, []);

  const handleEducationChange = (e) => {
    setEducation({ ...education, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const handleEmploymentChange = (e) => {
    setEmployment({ ...employment, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!education.highestLevel) newErrors.highestLevel = 'Highest level of education is required.';
    if (!education.institution) newErrors.institution = 'Institution name is required.';
    if (!education.fieldOfStudy) newErrors.fieldOfStudy = 'Field of study is required.';
    if (!education.yearOfPassing) newErrors.yearOfPassing = 'Year of passing is required.';
    if (!employment.dateOfHire) newErrors.dateOfHire = 'Date of hire is required.';
    if (!employment.jobStatus) newErrors.jobStatus = 'Job status is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Prevent form submission if there are validation errors
    }

    const formData = {
      ...personalDetails,
      ...education,
      ...employment,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_Port}/worker/WorkerPersonal-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      localStorage.removeItem('personalDetails');
      route.push('/worker/homepage');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      route.push('/worker/homepage');
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Educational Qualifications</h2>

      <div>
        <label className="block mb-1" htmlFor="highestLevel">
          Highest Level of Education
        </label>
        <input
          type="text"
          id="highestLevel"
          name="highestLevel"
          value={education.highestLevel}
          onChange={handleEducationChange}
          className={`border rounded p-2 w-full ${errors.highestLevel ? 'border-red-500' : ''}`}
          placeholder="Enter your highest level of education"
        />
        {errors.highestLevel && <p className="text-red-500 text-sm">{errors.highestLevel}</p>}
      </div>

      <div>
        <label className="block mb-1" htmlFor="institution">
          Name of Institution
        </label>
        <input
          type="text"
          id="institution"
          name="institution"
          value={education.institution}
          onChange={handleEducationChange}
          className={`border rounded p-2 w-full ${errors.institution ? 'border-red-500' : ''}`}
          placeholder="Enter the name of your institution"
        />
        {errors.institution && <p className="text-red-500 text-sm">{errors.institution}</p>}
      </div>

      <div>
        <label className="block mb-1" htmlFor="fieldOfStudy">
          Field of Study
        </label>
        <input
          type="text"
          id="fieldOfStudy"
          name="fieldOfStudy"
          value={education.fieldOfStudy}
          onChange={handleEducationChange}
          className={`border rounded p-2 w-full ${errors.fieldOfStudy ? 'border-red-500' : ''}`}
          placeholder="Enter your field of study"
        />
        {errors.fieldOfStudy && <p className="text-red-500 text-sm">{errors.fieldOfStudy}</p>}
      </div>

      <div>
        <label className="block mb-1" htmlFor="yearOfPassing">
          Year of Passing Out
        </label>
        <input
          type="text"
          id="yearOfPassing"
          name="yearOfPassing"
          value={education.yearOfPassing}
          onChange={handleEducationChange}
          className={`border rounded p-2 w-full ${errors.yearOfPassing ? 'border-red-500' : ''}`}
          placeholder="Enter the year you passed out"
        />
        {errors.yearOfPassing && <p className="text-red-500 text-sm">{errors.yearOfPassing}</p>}
      </div>

      {/* Employment Details Section */}
      <h2 className="text-2xl font-bold mb-4">Employment Details</h2>

      <div>
        <label className="block mb-1" htmlFor="dateOfHire">
          Date of Hire
        </label>
        <input
          type="date"
          id="dateOfHire"
          name="dateOfHire"
          value={employment.dateOfHire}
          onChange={handleEmploymentChange}
          className={`border rounded p-2 w-full ${errors.dateOfHire ? 'border-red-500' : ''}`}
        />
        {errors.dateOfHire && <p className="text-red-500 text-sm">{errors.dateOfHire}</p>}
      </div>

      <div>
        <label className="block mb-1" htmlFor="department">
          Department <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={employment.department}
          onChange={handleEmploymentChange}
          className="border rounded p-2 w-full"
          placeholder="Enter your department (if applicable)"
        />
      </div>

      <div>
        <label className="block mb-1" htmlFor="jobStatus">
          Job Status
        </label>
        <select
          id="jobStatus"
          name="jobStatus"
          value={employment.jobStatus}
          onChange={handleEmploymentChange}
          className={`border rounded p-2 w-full ${errors.jobStatus ? 'border-red-500' : ''}`}
        >
          <option value="">Select job status</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="intern">Intern</option>
          <option value="contract">Contract</option>
        </select>
        {errors.jobStatus && <p className="text-red-500 text-sm">{errors.jobStatus}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default EducationDetails;
