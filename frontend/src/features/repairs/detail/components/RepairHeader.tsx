import { Box, Typography, IconButton } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Repair } from '@/entities/repair';

interface RepairHeaderProps {
  repair: Repair;
  onDelete: () => void;
  isDeleting: boolean;
  vehicleId?: string;
}

export const RepairHeader = ({
  repair,
  onDelete,
  isDeleting,
  vehicleId,
}: RepairHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (vehicleId) {
      navigate(`/vehicles/${vehicleId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <IconButton onClick={handleBack}>
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'none' }}>
          {repair.name || `Ремонт #${repair.id.slice(0, 8)}`}
        </Typography>
      </Box>
      <IconButton
        color="primary"
        onClick={() => navigate(`/repairs/${repair.id}/edit`)}
        title="Редактировать"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        color="error"
        onClick={onDelete}
        disabled={isDeleting}
        title="Удалить"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

