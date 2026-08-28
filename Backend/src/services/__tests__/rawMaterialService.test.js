jest.mock('../../repositories/rawMaterialRepository');

const repository = require('../../repositories/rawMaterialRepository');
const service = require('../rawMaterialService');

describe('rawMaterialService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('crée une matière première quand le nom et le code sont uniques', async () => {
      repository.findByNameOrCode.mockResolvedValue([]);
      repository.create.mockResolvedValue({ id: 1, name: 'Glycérine', code: 'MP-001' });

      const result = await service.create({ name: 'Glycérine', code: 'MP-001' });

      expect(repository.findByNameOrCode).toHaveBeenCalledWith('Glycérine', 'MP-001');
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, name: 'Glycérine', code: 'MP-001' });
    });

    it('lève une erreur 409 DUPLICATE si le nom existe déjà', async () => {
      repository.findByNameOrCode.mockResolvedValue([
        { id: 2, name: 'Glycérine', code: 'MP-999' },
      ]);

      await expect(
        service.create({ name: 'Glycérine', code: 'MP-001' })
      ).rejects.toMatchObject({
        statusCode: 409,
        code: 'DUPLICATE',
      });

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('lève une erreur 409 DUPLICATE si le code existe déjà', async () => {
      repository.findByNameOrCode.mockResolvedValue([
        { id: 2, name: 'Autre Nom', code: 'MP-001' },
      ]);

      await expect(
        service.create({ name: 'Glycérine', code: 'MP-001' })
      ).rejects.toMatchObject({
        statusCode: 409,
        code: 'DUPLICATE',
      });
    });
  });

  describe('getById', () => {
    it('retourne la matière première si elle existe', async () => {
      repository.findById.mockResolvedValue({ id: 1, name: 'Glycérine' });

      const result = await service.getById(1);

      expect(result).toEqual({ id: 1, name: 'Glycérine' });
    });

    it("lève une erreur 404 NOT_FOUND si elle n'existe pas", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getById(999)).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      });
    });
  });

  describe('update', () => {
    it('met à jour la matière première quand tout est valide', async () => {
      repository.findById.mockResolvedValue({ id: 1, name: 'Ancien nom', code: 'MP-001' });
      repository.findByNameOrCode.mockResolvedValue([]);
      repository.update.mockResolvedValue({ id: 1, name: 'Nouveau nom', code: 'MP-001' });

      const result = await service.update(1, { name: 'Nouveau nom', code: 'MP-001' });

      expect(result.name).toBe('Nouveau nom');
    });

    it("lève une erreur 404 si la matière première à modifier n'existe pas", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'X', code: 'Y' })
      ).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      });
    });

    it('lève une erreur 409 si le nouveau nom/code appartient à une autre entrée', async () => {
      repository.findById.mockResolvedValue({ id: 1, name: 'Ancien nom', code: 'MP-001' });
      repository.findByNameOrCode.mockResolvedValue([
        { id: 2, name: 'Nouveau nom', code: 'MP-002' },
      ]);

      await expect(
        service.update(1, { name: 'Nouveau nom', code: 'MP-001' })
      ).rejects.toMatchObject({
        statusCode: 409,
        code: 'DUPLICATE',
      });
    });
  });

  describe('remove', () => {
    it('supprime la matière première si elle existe', async () => {
      repository.remove.mockResolvedValue({ id: 1, name: 'Glycérine' });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1, name: 'Glycérine' });
    });

    it("lève une erreur 404 si la matière première à supprimer n'existe pas", async () => {
      repository.remove.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toMatchObject({
        statusCode: 404,
        code: 'NOT_FOUND',
      });
    });
  });

  describe('getAll', () => {
    it('retourne les items paginés avec les bonnes métadonnées', async () => {
      repository.findAll.mockResolvedValue({
        items: [{ id: 1, name: 'Glycérine' }],
        total: 1,
      });

      const result = await service.getAll({ page: 1, pageSize: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });
});