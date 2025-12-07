import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useRepairsList } from "./useRepairsList";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatCurrency } from '@/shared/lib/utils';
import { PageLayout } from "@/shared/ui/PageLayout";
import { ListWithLoader } from "@/shared/ui/ListWithLoader";
import { EMPTY_LIST_MESSAGE, ERROR_MESSAGE } from "./constants";

type RepairWithVehicle = ReturnType<typeof useRepairsList>['repairs'][0];

export const RepairsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicleId") || undefined;

  const { repairs, isLoading, isError } = useRepairsList({
    vehicleId,
  });

  return (
    <PageLayout
      actionButton={{
        icon: <AddIcon />,
        onClick: () =>
          navigate(
            vehicleId ? `/vehicles/${vehicleId}/repairs/new` : "/repairs/new"
          ),
      }}
      error={isError}
      errorMessage={ERROR_MESSAGE}
    >
      <ListWithLoader<RepairWithVehicle>
        isLoading={isLoading}
        items={repairs}
        emptyMessage={EMPTY_LIST_MESSAGE}
        getItemKey={(repair) => repair.id}
      >
        {(repair) => (
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => navigate(`/repairs/${repair.id}`)}
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
                  <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                    {repair.name || `Ремонт #${repair.id.slice(0, 8)}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Дата:{" "}
                    {new Date(repair.reportedAt).toLocaleDateString("ru-RU")}
                  </Typography>
                  {repair.mileage && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Пробег: {repair.mileage.toLocaleString("ru-RU")} км
                    </Typography>
                  )}
                  {repair.vehicle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {repair.vehicle.color ? `${repair.vehicle.color} ` : ''}{repair.vehicle.make} {repair.vehicle.model}
                      {repair.vehicle.plateNumber &&
                        ` (${repair.vehicle.plateNumber})`}
                    </Typography>
                  )}
                  {repair.comments && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontStyle: "italic" }}
                    >
                      {repair.comments}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    textAlign: { xs: "left", sm: "right" },
                    minWidth: { xs: "100%", sm: "150px" },
                  }}
                >
                  {repair.grandTotal > 0 && (
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      {formatCurrency(repair.grandTotal)}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: { xs: "flex-start", sm: "flex-end" },
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/repairs/${repair.id}/edit`);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </ListWithLoader>
    </PageLayout>
  );
};
