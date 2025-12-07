import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import { useVehiclesList } from "./useVehiclesList";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/shared/ui/PageLayout";
import { ListWithLoader } from "@/shared/ui/ListWithLoader";
import {
  SEARCH_PLACEHOLDER,
  EMPTY_LIST_MESSAGE,
  EMPTY_SEARCH_MESSAGE,
  ERROR_MESSAGE,
} from "./constants";
import { VehicleWithClient } from "@/entities/vehicle";

export const VehiclesList = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { vehicles, isLoading, isError } = useVehiclesList({
    plateNumber: search || undefined,
  });

  return (
    <PageLayout
      actionButton={{
        icon: <AddIcon />,
        onClick: () => navigate("/vehicles/new"),
      }}
      error={isError}
      errorMessage={ERROR_MESSAGE}
    >
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder={SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <ListWithLoader<VehicleWithClient>
        isLoading={isLoading}
        items={vehicles}
        emptyMessage={search ? EMPTY_SEARCH_MESSAGE : EMPTY_LIST_MESSAGE}
      >
        {(vehicle) => (
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "200px" } }}
                >
                  <Typography variant="h6" component="div">
                    {vehicle.color ? `${vehicle.color} ` : ""}
                    {vehicle.make} {vehicle.model}
                    {vehicle.year && ` (${vehicle.year})`}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {vehicle.plateNumber && (
                      <Chip
                        label={`Госномер: ${vehicle.plateNumber}`}
                        size="small"
                      />
                    )}
                    {vehicle.vin && (
                      <Chip label={`VIN: ${vehicle.vin}`} size="small" />
                    )}
                  </Box>
                </Box>
                {vehicle.client && (
                  <Box
                    sx={{
                      textAlign: { xs: "left", sm: "right" },
                      minWidth: { xs: "100%", sm: "150px" },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Владелец:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {vehicle.client.fullName}
                    </Typography>
                    {vehicle.client.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.client.phone}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </ListWithLoader>
    </PageLayout>
  );
};

