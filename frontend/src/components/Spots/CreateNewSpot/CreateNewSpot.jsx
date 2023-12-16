import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSpot, addSpotImage } from "../../../store/spots";
import { useNavigate } from "react-router-dom";
import "./CreateNewSpot.css";

const CreateNewSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [errors, setErrors] = useState({});

  const validUrl = (url) => {
    return (
      url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg")
    );
  };

  const validate = () => {
    setErrors({});

    if (!country)
      setErrors((errors) => ({ ...errors, country: "Country is required" }));

    if (!address)
      setErrors((errors) => ({ ...errors, address: "Address is required" }));

    if (!city) setErrors((errors) => ({ ...errors, city: "City is required" }));

    if (!state)
      setErrors((errors) => ({ ...errors, state: "State is required" }));

    if (!lat)
      setErrors((errors) => ({ ...errors, lat: "Latitude is required" }));

    if (!lng)
      setErrors((errors) => ({ ...errors, lng: "Longitude is required" }));

    if (!description || description.length < 30)
      setErrors((errors) => ({
        ...errors,
        description: "Description needs a minium of 30 characters",
      }));

    if (!name) setErrors((errors) => ({ ...errors, name: "Name is required" }));

    if (!price)
      setErrors((errors) => ({ ...errors, price: "Price is required" }));

    if (!previewImage)
      setErrors((errors) => ({
        ...errors,
        previewImage: "Preview Image is required",
      }));
    else if (!validUrl(previewImage))
      setErrors((errors) => ({
        ...errors,
        previewImage: "Image URL must end in .png, .jpg, or .jpeg",
      }));

    if (image1 && !validUrl(image1))
      setErrors((errors) => ({
        ...errors,
        image1: "Image URL must end in .png, .jpg, or .jpeg",
      }));

    if (image2 && !validUrl(image2))
      setErrors((errors) => ({
        ...errors,
        image2: "Image URL must end in .png, .jpg, or .jpeg",
      }));

    if (image3 && !validUrl(image3))
      setErrors((errors) => ({
        ...errors,
        image3: "Image URL must end in .png, .jpg, or .jpeg",
      }));

    if (image4 && !validUrl(image4))
      setErrors((errors) => ({
        ...errors,
        image4: "Image URL must end in .png, .jpg, or .jpeg",
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validate();

    if (Object.keys(errors).length === 0) {
      const newSpot = await dispatch(
        createSpot({
          country,
          address,
          city,
          state,
          lat,
          lng,
          name,
          description,
          price,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors((errors) => ({ ...errors, ...data.errors }));
        }
      });

      if (newSpot && newSpot.id) {
        dispatch(
          addSpotImage(newSpot.id, { url: previewImage, preview: true })
        );
        if (image1) {
          dispatch(addSpotImage(newSpot.id, { url: image1, preview: false }));
        }
        if (image2) {
          dispatch(addSpotImage(newSpot.id, { url: image2, preview: false }));
        }
        if (image3) {
          dispatch(addSpotImage(newSpot.id, { url: image3, preview: false }));
        }
        if (image4) {
          dispatch(addSpotImage(newSpot.id, { url: image4, preview: false }));
        }

        navigate(`/spots/${newSpot.id}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a new Spot</h2>

      <div>
        <h3>Where&apos;s your place located?</h3>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
      </div>

      <div>
        <label>
          Country
          <input
            type="text"
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
            id="country"
          />
        </label>
        {errors.country && <p>{errors.country}</p>}
      </div>
      <div>
        <label>
          Street Address
          <input
            type="text"
            value={address}
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            id="street-address"
          />
        </label>
        {errors.address && <p>{errors.address}</p>}
      </div>
      <div>
        <div>
          <label>
            City
            <input
              type="text"
              value={city}
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          {errors.city && <p>{errors.city}</p>}
        </div>
        <div>
          <label>
            State
            <input
              type="text"
              value={state}
              placeholder="STATE"
              onChange={(e) => setState(e.target.value)}
              id="state"
            />
          </label>
          {errors.state && <p>{errors.state}</p>}
        </div>
      </div>

      <div>
        <div>
          <label>
            Latitude
            <input
              type="text"
              value={lat}
              placeholder="Latitude"
              onChange={(e) => setLat(e.target.value)}
              id="latitude"
            />
          </label>
          {errors.lat && <p>{errors.lat}</p>}
        </div>
        <div>
          <label>
            Longitude
            <input
              type="text"
              value={lng}
              placeholder="Longitude"
              onChange={(e) => setLng(e.target.value)}
              id="longitude"
            />
          </label>
          {errors.lng && <p>{errors.lng}</p>}
        </div>
      </div>
      <hr />

      <div>
        <h3>Describe your place to guests</h3>
        <p>
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
      </div>
      <label>
        <textarea
          //   type="textarea"
          value={description}
          placeholder="Please write at least 30 characters"
          id="place-description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      {errors.description && <p>{errors.description}</p>}
      <hr />

      <div>
        <h3>Create a title for your spot</h3>
        <p>
          Catch guests&apos; attention with a spot title that highlights what
          makes your place special.
        </p>
      </div>
      {/* <label> */}
      <div>
        <input
          type="text"
          value={name}
          placeholder="Name of your spot"
          id="spot-name"
          onChange={(e) => setName(e.target.value)}
        />
        {/* </label> */}
        {errors.name && <p>{errors.name}</p>}
      </div>
      <hr />

      <div>
        <h3>Set a base price for your spot</h3>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        <label>
          $
          <input
            type="text"
            value={price}
            placeholder="Price per night (USD)"
            onChange={(e) => setPrice(e.target.value)}
            id="price"
          />
        </label>
        {errors.price && <p>{errors.price}</p>}
      </div>
      <hr />

      <div>
        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        {/* <label> */}
        <input
          type="text"
          value={previewImage}
          placeholder="Preview Image URL"
          id="previewImage"
          onChange={(e) => setPreviewImage(e.target.value)}
        />
        {errors.previewImage && <p>{errors.previewImage}</p>}
        {/* </label> */}
        {/* <label> */}
        <input
          type="text"
          value={image1}
          placeholder="Image URL"
          id="image1"
          onChange={(e) => setImage1(e.target.value)}
        />
        {/* </label> */}
        {errors.image1 && <p>{errors.image1}</p>}
        {/* <label> */}
        <input
          type="text"
          value={image2}
          placeholder="Image URL"
          id="image2"
          onChange={(e) => setImage2(e.target.value)}
        />
        {/* </label> */}
        {errors.image2 && <p>{errors.image2}</p>}
        {/* <label> */}
        <input
          type="text"
          value={image3}
          placeholder="Image URL"
          onChange={(e) => setImage3(e.target.value)}
        />
        {/* </label> */}
        {errors.image3 && <p>{errors.image3}</p>}
        {/* <label> */}
        <input
          type="text"
          value={image4}
          placeholder="Image URL"
          onChange={(e) => setImage4(e.target.value)}
        />
        {/* </label> */}
        {errors.image4 && <p>{errors.image4}</p>}
      </div>
      <hr />
      {/* <div> */}
      <button type="submit">Create Spot</button>
      {/* </div> */}
    </form>
  );
};

export default CreateNewSpot;
