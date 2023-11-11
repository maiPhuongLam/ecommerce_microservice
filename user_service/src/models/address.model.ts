import mongoose from "mongoose";

export interface Address extends Document {
  street: string;
  postalCode: number;
  city: string;
  country: string;
}

const Schema = mongoose.Schema;
const addressSchema = new Schema<Address>({
  street: { type: String, required: true },
  postalCode: { type: Number, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
});

const AddressModel = mongoose.model<Address>("Address", addressSchema);

export default AddressModel;
