import { AlbumModel } from '../model/albums';

export interface AlbumQuery {
  filter: Record<string, string>;
  sort?: string;
  fields?: string;
  page: number;
  limit: number;
}

export class AlbumService {
  getAll(q: AlbumQuery) {
    let query = AlbumModel.find(q.filter);
    if (q.sort) query = query.sort(q.sort);          // e.g. "releaseYear" or "-releaseYear"
    if (q.fields) query = query.select(q.fields);    // e.g. "title genre"
    return query
      .skip((q.page - 1) * q.limit)
      .limit(q.limit)
      .populate('artist');
  }

  async getById(id: string) {
    return await AlbumModel.findById(id).populate('artist');
  }

  async getByArtist(artistId: string) {
    return await AlbumModel.find({ artist: artistId });
  }

  async create(data: object) {
    return await AlbumModel.create(data);
  }

  async update(id: string, data: object) {
    return await AlbumModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  }

  async delete(id: string) {
    return await AlbumModel.findByIdAndDelete(id);
  }

  async deleteByArtist(artistId: string) {
    return await AlbumModel.deleteMany({ artist: artistId });
  }
}
