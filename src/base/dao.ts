export interface IDao<DTO> {
  create(input: DTO): Promise<void>;
  update(id: string | number, input: Partial<DTO>): Promise<void>;
  delete(id: string | number): Promise<void>;
  find(): Promise<DTO[]>;
  findById(id: string): Promise<DTO>;
}
