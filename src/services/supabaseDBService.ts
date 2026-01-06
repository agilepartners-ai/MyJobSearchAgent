import { supabase } from '../lib/supabase';

export class SupabaseDBService {
  // Create a new document in a table and return its ID
  static async create<T extends Record<string, any>>(tablePath: string, data: T): Promise<string> {
    if (!tablePath || typeof tablePath !== 'string') {
      throw new Error(`[Supabase] Invalid table path: "${tablePath}"`);
    }

    // Parse table path (e.g., "users/123/jobApplications" -> table: "job_applications", parent: "users/123")
    const pathParts = tablePath.split('/');
    const tableName = this.convertPathToTableName(pathParts[pathParts.length - 1]);
    
    // Extract parent reference if it's a nested path
    const parentPath = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : null;
    const parentId = parentPath ? pathParts[pathParts.length - 2] : null;
    const parentTable = parentPath && pathParts.length > 2 ? this.convertPathToTableName(pathParts[pathParts.length - 3]) : null;

    // Add parent reference if it's a nested structure
    const dataWithParent: Record<string, any> = { ...data };
    if (parentId && parentTable) {
      // Add foreign key reference (e.g., user_id for users/123/jobApplications)
      const foreignKey = `${parentTable.slice(0, -1)}_id`; // Remove 's' and add '_id'
      dataWithParent[foreignKey] = parentId;
    }

    const { data: result, error } = await supabase
      .from(tableName)
      .insert(dataWithParent)
      .select('id')
      .single();

    if (error) {
      throw new Error(`[Supabase] Failed to create document: ${error.message}`);
    }

    return result.id;
  }

  // Read a single document from Supabase
  static async read<T>(documentPath: string): Promise<T | null> {
    if (!documentPath || typeof documentPath !== 'string') {
      throw new Error(`[Supabase] Invalid document path: "${documentPath}"`);
    }

    const pathParts = documentPath.split('/');
    
    // Handle single document (e.g., "users/123")
    if (pathParts.length === 2) {
      const tableName = this.convertPathToTableName(pathParts[0]);
      const id = pathParts[1];
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Document not found
        }
        throw new Error(`[Supabase] Failed to read document: ${error.message}`);
      }

      return data as T;
    }

    // Handle nested document (e.g., "users/123/jobApplications/456")
    if (pathParts.length === 4) {
      const tableName = this.convertPathToTableName(pathParts[2]);
      const id = pathParts[3];
      const parentTable = this.convertPathToTableName(pathParts[0]);
      const parentId = pathParts[1];
      const foreignKey = `${parentTable.slice(0, -1)}_id`;

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .eq(foreignKey, parentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Document not found
        }
        throw new Error(`[Supabase] Failed to read document: ${error.message}`);
      }

      return data as T;
    }

    throw new Error(`[Supabase] Invalid document path format: "${documentPath}"`);
  }

  // Update specific fields in a document
  static async update<T extends Partial<Record<string, any>>>(documentPath: string, data: T): Promise<void> {
    if (!documentPath || typeof documentPath !== 'string') {
      throw new Error(`[Supabase] Invalid document path: "${documentPath}"`);
    }

    const pathParts = documentPath.split('/');
    
    // Handle single document
    if (pathParts.length === 2) {
      const tableName = this.convertPathToTableName(pathParts[0]);
      const id = pathParts[1];
      
      const { error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id);

      if (error) {
        throw new Error(`[Supabase] Failed to update document: ${error.message}`);
      }
      return;
    }

    // Handle nested document
    if (pathParts.length === 4) {
      const tableName = this.convertPathToTableName(pathParts[2]);
      const id = pathParts[3];
      const parentTable = this.convertPathToTableName(pathParts[0]);
      const parentId = pathParts[1];
      const foreignKey = `${parentTable.slice(0, -1)}_id`;

      const { error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .eq(foreignKey, parentId);

      if (error) {
        throw new Error(`[Supabase] Failed to update document: ${error.message}`);
      }
      return;
    }

    throw new Error(`[Supabase] Invalid document path format: "${documentPath}"`);
  }

  // Set (overwrite) a document entirely
  static async set<T extends Record<string, any>>(documentPath: string, data: T): Promise<void> {
    // For Supabase, set is equivalent to upsert
    const pathParts = documentPath.split('/');
    
    if (pathParts.length === 2) {
      const tableName = this.convertPathToTableName(pathParts[0]);
      const id = pathParts[1];
      
      const { error } = await supabase
        .from(tableName)
        .upsert({ ...data, id }, { onConflict: 'id' });

      if (error) {
        throw new Error(`[Supabase] Failed to set document: ${error.message}`);
      }
      return;
    }

    if (pathParts.length === 4) {
      const tableName = this.convertPathToTableName(pathParts[2]);
      const id = pathParts[3];
      
      const { error } = await supabase
        .from(tableName)
        .upsert({ ...data, id }, { onConflict: 'id' });

      if (error) {
        throw new Error(`[Supabase] Failed to set document: ${error.message}`);
      }
      return;
    }

    throw new Error(`[Supabase] Invalid document path format: "${documentPath}"`);
  }

  // Delete a document
  static async delete(documentPath: string): Promise<void> {
    if (!documentPath || typeof documentPath !== 'string') {
      throw new Error(`[Supabase] Invalid document path: "${documentPath}"`);
    }

    const pathParts = documentPath.split('/');
    
    // Handle single document
    if (pathParts.length === 2) {
      const tableName = this.convertPathToTableName(pathParts[0]);
      const id = pathParts[1];
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`[Supabase] Failed to delete document: ${error.message}`);
      }
      return;
    }

    // Handle nested document
    if (pathParts.length === 4) {
      const tableName = this.convertPathToTableName(pathParts[2]);
      const id = pathParts[3];
      const parentTable = this.convertPathToTableName(pathParts[0]);
      const parentId = pathParts[1];
      const foreignKey = `${parentTable.slice(0, -1)}_id`;

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .eq(foreignKey, parentId);

      if (error) {
        throw new Error(`[Supabase] Failed to delete document: ${error.message}`);
      }
      return;
    }

    throw new Error(`[Supabase] Invalid document path format: "${documentPath}"`);
  }

  // Fetch all documents in a collection as an array
  static async getList<T = Record<string, any>>(collectionPath: string): Promise<(T & { id: string })[]> {
    if (!collectionPath || typeof collectionPath !== 'string') {
      throw new Error(`[Supabase] Invalid collection path: "${collectionPath}"`);
    }

    const pathParts = collectionPath.split('/');
    const tableName = this.convertPathToTableName(pathParts[pathParts.length - 1]);
    
    // Handle nested collection (e.g., "users/123/jobApplications")
    if (pathParts.length === 3) {
      const parentTable = this.convertPathToTableName(pathParts[0]);
      const parentId = pathParts[1];
      const foreignKey = `${parentTable.slice(0, -1)}_id`;

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq(foreignKey, parentId);

      if (error) {
        throw new Error(`[Supabase] Failed to get list: ${error.message}`);
      }

      return (data || []) as (T & { id: string })[];
    }

    // Handle top-level collection
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      throw new Error(`[Supabase] Failed to get list: ${error.message}`);
    }

    return (data || []) as (T & { id: string })[];
  }

  // Convert camelCase path to Supabase table name (snake_case)
  // e.g., "jobApplications" -> "job_applications", "workExperience" -> "work_experience"
  private static convertPathToTableName(path: string): string {
    // Convert camelCase to snake_case
    return path
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }
}

