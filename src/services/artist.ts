import { ArtistModel, IArtist } from '../model/artist';

export class ArtistService {
  getAll() {
    return ArtistModel.find();
  }

  getById(id: string) {
    return ArtistModel.findById(id);
  }

  create(data: IArtist) {
    return ArtistModel.create(data);
  }

  update(id: string, data: IArtist) {
    return ArtistModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  }

  delete(id: string) {
    return ArtistModel.findByIdAndDelete(id);
  }
}
