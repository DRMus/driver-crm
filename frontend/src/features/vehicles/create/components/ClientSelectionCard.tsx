import { Control, FieldErrors } from "react-hook-form";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { CreateVehicleFormData } from "../schemas";
import { CLIENT_MODE, type ClientMode } from "../constants";
import { ExistingClientSelect } from "./ExistingClientSelect";
import { NewClientForm } from "./NewClientForm";

interface ClientSelectionCardProps {
  control: Control<CreateVehicleFormData>;
  errors: FieldErrors<CreateVehicleFormData>;
  clientMode: ClientMode;
  onModeChange: (mode: ClientMode) => void;
  resetField: (name: keyof CreateVehicleFormData) => void;
  isEditMode: boolean;
  clientName?: string;
  clientPhone?: string;
  clientsData?: {
    data?: Array<{ id: string; fullName: string; phone?: string }>;
  };
}

export const ClientSelectionCard = ({
  control,
  errors,
  clientMode,
  onModeChange,
  resetField,
  isEditMode,
  clientName,
  clientPhone,
  clientsData,
}: ClientSelectionCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Клиент
        </Typography>
        <Divider sx={{ my: 2 }} />
        {!isEditMode && (
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Button
              variant={
                clientMode === CLIENT_MODE.NEW ? "contained" : "outlined"
              }
              onClick={() => {
                onModeChange(CLIENT_MODE.NEW);
                resetField("clientId");
              }}
              fullWidth
            >
              Создать нового клиента
            </Button>
            <Button
              variant={
                clientMode === CLIENT_MODE.EXISTING ? "contained" : "outlined"
              }
              onClick={() => {
                onModeChange(CLIENT_MODE.EXISTING);
                resetField("newClient");
              }}
              fullWidth
            >
              Выбрать существующего клиента
            </Button>
          </Stack>
        )}
        {isEditMode && clientName && (
          <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Владелец
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {clientName}
            </Typography>
            {clientPhone && (
              <Typography variant="body2" color="text.secondary">
                {clientPhone}
              </Typography>
            )}
          </Box>
        )}

        <Stack spacing={2}>
          {clientMode === CLIENT_MODE.EXISTING && (
            <ExistingClientSelect
              control={control}
              error={errors.clientId}
              clientsData={clientsData}
            />
          )}

          {clientMode === CLIENT_MODE.NEW && (
            <NewClientForm control={control} errors={errors.newClient} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
