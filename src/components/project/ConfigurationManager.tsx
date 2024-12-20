import React, { useState, useEffect } from 'react';
import { Card } from '../layout/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import {
  ProjectConfig,
  loadAllConfigurations,
  saveConfiguration,
  deleteConfiguration,
  createNewConfiguration
} from '../../services/configurationService';

interface ConfigurationManagerProps {
  currentConfig?: ProjectConfig;
  onConfigLoad: (config: ProjectConfig) => void;
  onConfigSave: (config: ProjectConfig) => void;
}

export const ConfigurationManager: React.FC<ConfigurationManagerProps> = ({
  currentConfig,
  onConfigLoad,
  onConfigSave
}) => {
  const [configs, setConfigs] = useState<ProjectConfig[]>([]);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigDescription, setNewConfigDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      const loadedConfigs = await loadAllConfigurations();
      setConfigs(loadedConfigs);
    } catch (error) {
      toast.error('Failed to load configurations');
    }
  };

  const handleSaveNew = async () => {
    if (!newConfigName.trim()) {
      toast.error('Please enter a configuration name');
      return;
    }

    setIsLoading(true);
    try {
      const newConfig = createNewConfiguration(
        newConfigName.trim(),
        newConfigDescription.trim() || undefined
      );
      await onConfigSave(newConfig);
      await loadConfigurations();
      setNewConfigName('');
      setNewConfigDescription('');
      toast.success('Configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExisting = async () => {
    if (!currentConfig) return;

    setIsLoading(true);
    try {
      await onConfigSave(currentConfig);
      await loadConfigurations();
      toast.success('Configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (config: ProjectConfig) => {
    if (!window.confirm(`Are you sure you want to delete "${config.name}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteConfiguration(config.id);
      await loadConfigurations();
      toast.success('Configuration deleted successfully');
    } catch (error) {
      toast.error('Failed to delete configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-medium text-text mb-4">Save Configuration</h3>
        <div className="space-y-4">
          <Input
            label="Configuration Name"
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
            placeholder="Enter configuration name"
          />
          <Input
            label="Description (optional)"
            value={newConfigDescription}
            onChange={(e) => setNewConfigDescription(e.target.value)}
            placeholder="Enter description"
          />
          <div className="flex justify-end space-x-2">
            {currentConfig && (
              <Button
                variant="secondary"
                onClick={handleSaveExisting}
                disabled={isLoading}
              >
                Update Current
              </Button>
            )}
            <Button
              onClick={handleSaveNew}
              disabled={isLoading || !newConfigName.trim()}
            >
              Save New
            </Button>
          </div>
        </div>
      </Card>

      {configs.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-text mb-4">Saved Configurations</h3>
          <div className="space-y-4">
            {configs.map(config => (
              <div
                key={config.id}
                className="flex items-center justify-between p-4 border border-border rounded-md"
              >
                <div>
                  <h4 className="font-medium text-text">{config.name}</h4>
                  {config.description && (
                    <p className="text-sm text-text-secondary mt-1">
                      {config.description}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary mt-1">
                    Modified: {formatDate(config.modified)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => onConfigLoad(config)}
                    disabled={isLoading}
                  >
                    Load
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(config)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
